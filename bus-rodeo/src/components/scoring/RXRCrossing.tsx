import type { Driver } from '../../types'
import ScoreWrapper from './ScoreWrapper'
import { Card, CheckItem, SectionTitle } from '../ui'

function computeDemerits(data: Record<string, number | boolean | string>): number {
  let d = 0
  if (data.noComplete) d += 75
  if (data.noHeadlightsOrBelt) d += 75
  if (data.noTurnSignal) d += 25
  if (data.noStop1550) d += 75
  if (data.noDoorWindow) d += 75
  if (data.noTrackCheck) d += 75
  if (data.noLeftMirror) d += 10
  if (data.noRightMirror) d += 10
  if (data.noRearMirror) d += 10
  if (data.noDoorClose) d += 25
  if (data.noRear15Clear) d += 75
  if (data.improperFlashers) d += 25
  if (data.backed) d += 75
  if (data.shiftOnTracks) d += 75
  if (data.stopsOnTracks) d += 75
  return d
}

export default function RXRCrossing({ driver, onBack }: { driver: Driver; onBack: () => void }) {
  return (
    <ScoreWrapper driver={driver} eventKey="rxr_crossing" onBack={onBack} computeDemerits={computeDemerits}>
      {(data, setData) => (
        <>
          <Card className="px-4 py-2">
            <SectionTitle>Approach – Failure to…</SectionTitle>
            <CheckItem label="Complete the event" checked={!!data.noComplete} onChange={v => setData({ noComplete: v })} demerits={75} penalty />
            <CheckItem label="Drive with headlights on / wear seat belt" checked={!!data.noHeadlightsOrBelt} onChange={v => setData({ noHeadlightsOrBelt: v })} demerits={75} penalty />
            <CheckItem label="Properly use turn signals" checked={!!data.noTurnSignal} onChange={v => setData({ noTurnSignal: v })} demerits={25} penalty />
            <CheckItem label="Stop between 15 and 50 feet from nearest rail" checked={!!data.noStop1550} onChange={v => setData({ noStop1550: v })} demerits={75} penalty />
            <CheckItem label="Stop, open door or window at crossing" checked={!!data.noDoorWindow} onChange={v => setData({ noDoorWindow: v })} demerits={75} penalty />
            <CheckItem label="Check tracks both directions before crossing" checked={!!data.noTrackCheck} onChange={v => setData({ noTrackCheck: v })} demerits={75} penalty />
            <CheckItem label="Check left outside mirror before crossing" checked={!!data.noLeftMirror} onChange={v => setData({ noLeftMirror: v })} demerits={10} penalty />
            <CheckItem label="Check right outside mirror before crossing" checked={!!data.noRightMirror} onChange={v => setData({ noRightMirror: v })} demerits={10} penalty />
            <CheckItem label="Check inside rearview mirror before crossing" checked={!!data.noRearMirror} onChange={v => setData({ noRearMirror: v })} demerits={10} penalty />
            <CheckItem label="Close entrance door" checked={!!data.noDoorClose} onChange={v => setData({ noDoorClose: v })} demerits={25} penalty />
            <CheckItem label="Clear rear of bus 15+ feet from nearest rail after crossing" checked={!!data.noRear15Clear} onChange={v => setData({ noRear15Clear: v })} demerits={75} penalty />
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Other Violations</SectionTitle>
            <CheckItem label="Improper use of 8-light school bus flashers" checked={!!data.improperFlashers} onChange={v => setData({ improperFlashers: v })} demerits={25} penalty />
            <CheckItem label="Backed bus during event" checked={!!data.backed} onChange={v => setData({ backed: v })} demerits={75} penalty />
            <CheckItem label="Shifted gears manually while crossing tracks" checked={!!data.shiftOnTracks} onChange={v => setData({ shiftOnTracks: v })} demerits={75} penalty />
            <CheckItem label="Bus stopped on tracks" checked={!!data.stopsOnTracks} onChange={v => setData({ stopsOnTracks: v })} demerits={75} penalty />
          </Card>
        </>
      )}
    </ScoreWrapper>
  )
}
