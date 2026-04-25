import type { Driver } from '../../types'
import ScoreWrapper from './ScoreWrapper'
import { Card, CheckItem, SectionTitle } from '../ui'

// Curb distance zones
const CURB_ZONES = [
  { label: '0" – 12" from curb', value: 'near', demerits: 0 },
  { label: '12" – 18" from curb', value: 'mid', demerits: 25 },
  { label: 'Over 18" from curb', value: 'far', demerits: 75 },
]

function computeDemerits(data: Record<string, number | boolean | string>): number {
  let d = 0
  // Curb zone
  d += Number(data.curbZoneDemerits ?? 0)
  // Entering violations
  if (data.backed) d += 75
  if (data.hitBarrier) d += 75
  if (data.multiStop) d += 75
  if (data.curbTouch) d += 75
  // Failure to…
  if (data.noHeadlights) d += 75
  if (data.noSeatbelt) d += 75
  if (data.noMirrorCheck1) d += 50
  if (data.noAmberLights) d += 75
  if (data.noApproachSignal) d += 75
  if (data.noCancelSignal1) d += 25
  if (data.noNeutralBrake) d += 75
  if (data.noMirrorCheck2) d += 50
  if (data.noRedLightsStopArm) d += 75
  if (data.notStop10ftBack) d += 25
  if (data.notStop15ftAway) d += 25
  if (data.noDoorOpen) d += 75
  // Exiting violations
  if (data.noDoorClose) d += 50
  if (data.noMirrorCheck3) d += 75
  if (data.noStudentsSeated) d += 75
  if (data.noDeactivateRed) d += 75
  if (data.noMirrorCheck4) d += 75
  if (data.noDepartSignal) d += 75
  if (data.noCancelSignal2) d += 25
  if (data.noComplete) d += 75
  if (data.exitBacked) d += 50
  if (data.exitBarrier) d += 50
  return d
}

function CurbZoneSelector({
  data, setData,
}: {
  data: Record<string, number | boolean | string>
  setData: (p: Record<string, number | boolean | string>) => void
}) {
  const current = String(data.curbZone ?? '')
  return (
    <div className="py-3 space-y-2 border-b border-gray-100">
      <p className="text-sm font-medium text-gray-800">Bus distance from curb (furthest of front/rear)</p>
      {CURB_ZONES.map(zone => (
        <button
          key={zone.value}
          onClick={() => setData({ curbZone: zone.value, curbZoneDemerits: zone.demerits })}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
            current === zone.value
              ? zone.demerits === 0 ? 'border-green-500 bg-green-50 text-green-700'
              : zone.demerits === 25 ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
              : 'border-red-500 bg-red-50 text-red-700'
              : 'border-gray-200 bg-white text-gray-600'
          }`}
        >
          <span>{zone.label}</span>
          <span>{zone.demerits === 0 ? '0 pts' : `−${zone.demerits} pts`}</span>
        </button>
      ))}
    </div>
  )
}

export default function CurbLineLoading({ driver, onBack }: { driver: Driver; onBack: () => void }) {
  return (
    <ScoreWrapper driver={driver} eventKey="curb_line_loading" onBack={onBack} computeDemerits={computeDemerits}>
      {(data, setData) => (
        <>
          <Card className="px-4 py-2">
            <SectionTitle>Curb Distance</SectionTitle>
            <CurbZoneSelector data={data} setData={setData} />
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Entering – Violations</SectionTitle>
            <CheckItem label="Backed bus" checked={!!data.backed} onChange={v => setData({ backed: v })} demerits={75} penalty />
            <CheckItem label="Bus hit barrier" checked={!!data.hitBarrier} onChange={v => setData({ hitBarrier: v })} demerits={75} penalty />
            <CheckItem label="Bus stopped more than once between barriers" checked={!!data.multiStop} onChange={v => setData({ multiStop: v })} demerits={75} penalty />
            <CheckItem label="Tire/tread touches curb on approach" checked={!!data.curbTouch} onChange={v => setData({ curbTouch: v })} demerits={75} penalty />
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Entering – Failure to…</SectionTitle>
            <CheckItem label="Drive with headlights activated" checked={!!data.noHeadlights} onChange={v => setData({ noHeadlights: v })} demerits={75} penalty />
            <CheckItem label="Wear lap/shoulder belts" checked={!!data.noSeatbelt} onChange={v => setData({ noSeatbelt: v })} demerits={75} penalty />
            <CheckItem label="Perform 5-point mirror check (approach)" checked={!!data.noMirrorCheck1} onChange={v => setData({ noMirrorCheck1: v })} demerits={50} penalty />
            <CheckItem label="Activate amber warning lights (100 ft prior)" checked={!!data.noAmberLights} onChange={v => setData({ noAmberLights: v })} demerits={75} penalty />
            <CheckItem label="Activate proper directional signal on approach" checked={!!data.noApproachSignal} onChange={v => setData({ noApproachSignal: v })} demerits={75} penalty />
            <CheckItem label="Cancel directional signal" checked={!!data.noCancelSignal1} onChange={v => setData({ noCancelSignal1: v })} demerits={25} penalty />
            <CheckItem label="Place bus in neutral/park & set parking brake" checked={!!data.noNeutralBrake} onChange={v => setData({ noNeutralBrake: v })} demerits={75} penalty />
            <CheckItem label="Perform correct mirror check (stopped)" checked={!!data.noMirrorCheck2} onChange={v => setData({ noMirrorCheck2: v })} demerits={50} penalty />
            <CheckItem label="Activate red flashing crossover lights & deploy stop arm" checked={!!data.noRedLightsStopArm} onChange={v => setData({ noRedLightsStopArm: v })} demerits={75} penalty />
            <CheckItem label="Stop at least 10 ft from student sign" checked={!!data.notStop10ftBack} onChange={v => setData({ notStop10ftBack: v })} demerits={25} penalty />
            <CheckItem label="Stop within 15 ft of student sign" checked={!!data.notStop15ftAway} onChange={v => setData({ notStop15ftAway: v })} demerits={25} penalty />
            <CheckItem label="Open service door when safe to do so" checked={!!data.noDoorOpen} onChange={v => setData({ noDoorOpen: v })} demerits={75} penalty />
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Exiting – Failure to…</SectionTitle>
            <CheckItem label="Close service door before putting bus in motion" checked={!!data.noDoorClose} onChange={v => setData({ noDoorClose: v })} demerits={50} penalty />
            <CheckItem label="Perform 5-point mirror check (before departure)" checked={!!data.noMirrorCheck3} onChange={v => setData({ noMirrorCheck3: v })} demerits={75} penalty />
            <CheckItem label="Ensure students are safely seated" checked={!!data.noStudentsSeated} onChange={v => setData({ noStudentsSeated: v })} demerits={75} penalty />
            <CheckItem label="Deactivate red flashing crossover lights" checked={!!data.noDeactivateRed} onChange={v => setData({ noDeactivateRed: v })} demerits={75} penalty />
            <CheckItem label="Perform additional 5-point mirror check" checked={!!data.noMirrorCheck4} onChange={v => setData({ noMirrorCheck4: v })} demerits={75} penalty />
            <CheckItem label="Activate proper directional signal for departure" checked={!!data.noDepartSignal} onChange={v => setData({ noDepartSignal: v })} demerits={75} penalty />
            <CheckItem label="Cancel directional signal" checked={!!data.noCancelSignal2} onChange={v => setData({ noCancelSignal2: v })} demerits={25} penalty />
            <CheckItem label="Complete event" checked={!!data.noComplete} onChange={v => setData({ noComplete: v })} demerits={75} penalty />
            <CheckItem label="Backed bus (exiting)" checked={!!data.exitBacked} onChange={v => setData({ exitBacked: v })} demerits={50} penalty />
            <CheckItem label="Bus hit barrier (exiting)" checked={!!data.exitBarrier} onChange={v => setData({ exitBarrier: v })} demerits={50} penalty />
          </Card>
        </>
      )}
    </ScoreWrapper>
  )
}
