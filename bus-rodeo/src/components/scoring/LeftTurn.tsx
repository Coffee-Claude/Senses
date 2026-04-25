import type { Driver } from '../../types'
import ScoreWrapper from './ScoreWrapper'
import { Card, CheckItem, CounterInput, SectionTitle } from '../ui'

const TEMPLATE_OPTIONS = [
  { label: 'Yellow (0"–6")', value: 0 },
  { label: 'Black (6"–9")', value: 10 },
  { label: 'Red (9"–12")', value: 20 },
  { label: 'Off template', value: 25 },
]

function TemplateSelector({
  label, field, data, setData,
}: {
  label: string; field: string
  data: Record<string, number | boolean | string>
  setData: (p: Record<string, number | boolean | string>) => void
}) {
  const current = Number(data[field] ?? 0)
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <p className="text-sm font-medium text-gray-800 mb-2">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {TEMPLATE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setData({ [field]: opt.value })}
            className={`text-xs px-3 py-2 rounded-lg border-2 font-medium transition-colors ${
              current === opt.value
                ? opt.value === 0 ? 'border-green-500 bg-green-50 text-green-700'
                : opt.value === 10 ? 'border-gray-800 bg-gray-100 text-gray-900'
                : opt.value === 20 ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 bg-white text-gray-600'
            }`}
          >
            {opt.label}
            <span className="block text-xs opacity-70">{opt.value > 0 ? `−${opt.value} pts` : '0 pts'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function computeDemerits(data: Record<string, number | boolean | string>): number {
  let d = 0
  d += Number(data.entryZone ?? 0)
  d += Number(data.recoveryZone ?? 0)
  d += Math.min(25, Number(data.stops ?? 0) * 5)
  if (data.backed) d += 50
  if (data.curbTouch) d += 50
  if (data.noLeftSignalActivate) d += 10
  if (data.noLeftSignalCancel) d += 10
  if (data.noHeadlights) d += 50
  if (data.noSeatbelt) d += 50
  if (data.doorOpen) d += 50
  if (data.overtime) d += 50
  return d
}

export default function LeftTurn({ driver, onBack }: { driver: Driver; onBack: () => void }) {
  return (
    <ScoreWrapper driver={driver} eventKey="left_turn" onBack={onBack} computeDemerits={computeDemerits}>
      {(data, setData) => (
        <>
          <Card className="px-4 py-2">
            <SectionTitle>Template Scoring (left rear outside tire)</SectionTitle>
            <TemplateSelector label="Entry into turn" field="entryZone" data={data} setData={setData} />
            <TemplateSelector label="Recovery from turn" field="recoveryZone" data={data} setData={setData} />
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Counted Violations</SectionTitle>
            <CounterInput
              label="Stops during turn"
              value={Number(data.stops ?? 0)}
              onChange={v => setData({ stops: v })}
              min={0}
              demeritsEach={5}
              totalDemerits={Math.min(25, Number(data.stops ?? 0) * 5)}
            />
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Failures</SectionTitle>
            <CheckItem label="Backed bus during event" checked={!!data.backed} onChange={v => setData({ backed: v })} demerits={50} penalty />
            <CheckItem label="Any tire touched the curb line" checked={!!data.curbTouch} onChange={v => setData({ curbTouch: v })} demerits={50} penalty />
            <CheckItem label="Did not activate left directional signal" checked={!!data.noLeftSignalActivate} onChange={v => setData({ noLeftSignalActivate: v })} demerits={10} penalty />
            <CheckItem label="Did not cancel left directional signal" checked={!!data.noLeftSignalCancel} onChange={v => setData({ noLeftSignalCancel: v })} demerits={10} penalty />
            <CheckItem label="No headlights on" checked={!!data.noHeadlights} onChange={v => setData({ noHeadlights: v })} demerits={50} penalty />
            <CheckItem label="Did not wear seat belt" checked={!!data.noSeatbelt} onChange={v => setData({ noSeatbelt: v })} demerits={50} penalty />
            <CheckItem label="Door opened during event" checked={!!data.doorOpen} onChange={v => setData({ doorOpen: v })} demerits={50} penalty />
            <CheckItem label="Exceeded 15-second time limit" checked={!!data.overtime} onChange={v => setData({ overtime: v })} demerits={50} penalty />
          </Card>
        </>
      )}
    </ScoreWrapper>
  )
}
