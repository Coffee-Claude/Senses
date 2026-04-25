import type { Driver } from '../../types'
import ScoreWrapper from './ScoreWrapper'
import { Card, SectionTitle } from '../ui'

function computeDemerits(data: Record<string, number | boolean | string>): number {
  return Math.min(50, Number(data.demerits ?? 0))
}

export default function SurpriseEvent({ driver, onBack }: { driver: Driver; onBack: () => void }) {
  return (
    <ScoreWrapper driver={driver} eventKey="surprise" onBack={onBack} computeDemerits={computeDemerits}>
      {(data, setData) => (
        <Card className="px-4 py-2">
          <SectionTitle>Surprise Event</SectionTitle>
          <p className="text-xs text-gray-500 px-0 pb-3">
            Event announced at Orientation. Enter demerits directly as assessed by judge.
          </p>
          <div className="py-3">
            <label className="block text-sm font-medium text-gray-800 mb-2">Total Demerits Assessed</label>
            <input
              type="number"
              min={0}
              max={50}
              value={Number(data.demerits ?? 0)}
              onChange={e => setData({ demerits: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-2xl text-center font-bold focus:outline-none focus:border-yellow-400"
            />
            <p className="text-xs text-gray-400 text-center mt-1">Max 50 demerits</p>
          </div>
        </Card>
      )}
    </ScoreWrapper>
  )
}
