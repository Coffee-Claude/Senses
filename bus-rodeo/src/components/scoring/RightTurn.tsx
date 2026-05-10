import type { Driver } from '../../types'
import ScoreWrapper from './ScoreWrapper'
import { Card, CheckItem, SectionTitle } from '../ui'

// Template zone demerits: yellow=0, black=10, red=20, off=25
const TEMPLATE_OPTIONS = [
  { label: 'Yellow (0"–6" from curb)', value: 0 },
  { label: 'Black (6"–9" from curb)', value: 10 },
  { label: 'Red (9"–12" from curb)', value: 20 },
  { label: 'Off template (missed entirely)', value: 25 },
]

function computeDemerits(data: Record<string, number | boolean | string>): number {
  let d = 0
  d += Number(data.entryZone ?? 0)
  d += Number(data.recoveryZone ?? 0)
  if (data.improperFlashers) d += 25
  if (data.backed) d += 50
  if (data.stoppedInTurn) d += 50
  if (data.overtime) d += 50
  if (data.noComplete) d += 50
  if (data.noHeadlightsOrBelt) d += 50
  if (data.noTurnSignal) d += 25
  return d
}

function TemplateSelector({
  label,
  field,
  data,
  setData,
}: {
  label: string
  field: string
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

export default function RightTurn({ driver, onBack }: { driver: Driver; onBack: () => void }) {
  return (
    <ScoreWrapper driver={driver} eventKey="right_turn" onBack={onBack} computeDemerits={computeDemerits}>
      {(data, setData) => (
        <>
          <Card className="px-4 py-2">
            <SectionTitle>Template Scoring (right rear outside tire)</SectionTitle>
            <p className="text-xs text-gray-500 px-0 pb-2">Measured from curbside of each template</p>
            <TemplateSelector label="Entry into turn" field="entryZone" data={data} setData={setData} />
            <TemplateSelector label="Recovery from turn" field="recoveryZone" data={data} setData={setData} />
          </Card>

          <Card className="px-4 py-2">
            <SectionTitle>Other Violations</SectionTitle>
            <CheckItem label="Improper use of 8-light school bus flashers" checked={!!data.improperFlashers} onChange={v => setData({ improperFlashers: v })} demerits={25} penalty />
            <CheckItem label="Backed bus during event" checked={!!data.backed} onChange={v => setData({ backed: v })} demerits={50} penalty />
            <CheckItem label="Stopped while in turn" checked={!!data.stoppedInTurn} onChange={v => setData({ stoppedInTurn: v })} demerits={50} penalty />
            <CheckItem label="Exceeded 15-second time limit" checked={!!data.overtime} onChange={v => setData({ overtime: v })} demerits={50} penalty />
            <CheckItem label="Did not complete event" checked={!!data.noComplete} onChange={v => setData({ noComplete: v })} demerits={50} penalty />
            <CheckItem label="No headlights / no seat belt" checked={!!data.noHeadlightsOrBelt} onChange={v => setData({ noHeadlightsOrBelt: v })} demerits={50} penalty />
            <CheckItem label="Failure to properly use turn signals" checked={!!data.noTurnSignal} onChange={v => setData({ noTurnSignal: v })} demerits={25} penalty />
          </Card>
        </>
      )}
    </ScoreWrapper>
  )
}
