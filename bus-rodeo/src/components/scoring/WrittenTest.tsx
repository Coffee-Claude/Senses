import type { Driver, EventKey } from '../../types'
import ScoreWrapper from './ScoreWrapper'
import { Card, CounterInput, SectionTitle } from '../ui'

interface Props {
  driver: Driver
  eventKey: Extract<EventKey, 'written_general' | 'written_inspection'>
  onBack: () => void
}

function computeDemerits(data: Record<string, number | boolean | string>): number {
  const wrong = Number(data.wrongAnswers ?? 0)
  return Math.min(100, wrong * 4)
}

export default function WrittenTest({ driver, eventKey, onBack }: Props) {
  return (
    <ScoreWrapper driver={driver} eventKey={eventKey} onBack={onBack} computeDemerits={computeDemerits}>
      {(data, setData) => (
        <Card className="px-4 py-2">
          <SectionTitle>Written Test Scoring</SectionTitle>
          <p className="text-xs text-gray-500 px-4 pb-3">50 questions · 4 demerits per wrong/missed answer · 30 min limit</p>
          <CounterInput
            label="Wrong / missed answers"
            value={Number(data.wrongAnswers ?? 0)}
            onChange={v => setData({ wrongAnswers: v })}
            min={0}
            max={50}
            demeritsEach={4}
            totalDemerits={Math.min(100, Number(data.wrongAnswers ?? 0) * 4)}
          />
        </Card>
      )}
    </ScoreWrapper>
  )
}
