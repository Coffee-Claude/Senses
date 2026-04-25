import { useState } from 'react'
import { db } from '../store/db'
import type { Competition } from '../types'
import { Btn, PageHeader, Card } from './ui'

interface Props {
  onBack: () => void
  onCreate: (comp: Competition) => void
}

export default function CompetitionSetup({ onBack, onCreate }: Props) {
  const [name, setName] = useState('SBDISC 2026 – Austin')
  const [location, setLocation] = useState('Hays CISD, Austin TX')
  const [date, setDate] = useState('2026-06-28')
  const [includesSurprise, setIncludesSurprise] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const comp: Competition = {
      name: name.trim(),
      location: location.trim(),
      date,
      includesSurprise,
      createdAt: new Date().toISOString(),
    }
    const id = await db.competitions.add(comp)
    onCreate({ ...comp, id: id as number })
  }

  const label = 'block text-sm font-semibold text-gray-700 mb-1'
  const input = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400'

  return (
    <div className="min-h-screen bg-slate-100">
      <PageHeader title="New Competition" onBack={onBack} />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          <Card className="p-4 space-y-4">
            <div>
              <label className={label}>Competition Name</label>
              <input className={input} value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className={label}>Location</label>
              <input className={input} value={location} onChange={e => setLocation(e.target.value)} required />
            </div>
            <div>
              <label className={label}>Date</label>
              <input type="date" className={input} value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <label className="flex items-center gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={includesSurprise}
                onChange={e => setIncludesSurprise(e.target.checked)}
                className="w-5 h-5 accent-yellow-400"
              />
              <span className="text-sm font-medium text-gray-800">Include Surprise Event (+50 pts, max 800)</span>
            </label>
          </Card>
          <Btn type="submit" className="w-full mt-4 text-base py-4">
            Create Competition →
          </Btn>
        </form>
      </div>
    </div>
  )
}
