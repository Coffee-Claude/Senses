import { useState, useEffect } from 'react'
import { db } from '../store/db'
import type { Competition } from '../types'
import { Btn, Card } from './ui'

interface Props {
  onSelect: (comp: Competition) => void
  onCreate: () => void
}

export default function Home({ onSelect, onCreate }: Props) {
  const [competitions, setCompetitions] = useState<Competition[]>([])

  useEffect(() => {
    db.competitions.orderBy('id').reverse().toArray().then(setCompetitions)
  }, [])

  async function deleteComp(e: React.MouseEvent, id: number) {
    e.stopPropagation()
    if (!confirm('Delete this competition and all its scores?')) return
    await db.competitions.delete(id)
    await db.drivers.where('competitionId').equals(id).delete()
    await db.scores.where('competitionId').equals(id).delete()
    setCompetitions(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-yellow-400 px-4 py-6 shadow-md">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-2">🚌</div>
          <h1 className="text-yellow-900 font-bold text-2xl">Bus Rodeo Scorer</h1>
          <p className="text-yellow-800 text-sm mt-1">SBDISC Official Scoring App</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <Btn onClick={onCreate} className="w-full text-base py-4">
          + New Competition
        </Btn>

        {competitions.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recent Competitions</p>
            <div className="space-y-2">
              {competitions.map(comp => (
                <Card key={comp.id} className="cursor-pointer active:scale-[0.99] transition-transform" >
                  <div className="flex items-center justify-between p-4" onClick={() => onSelect(comp)}>
                    <div>
                      <p className="font-semibold text-gray-900">{comp.name}</p>
                      <p className="text-sm text-gray-500">{comp.location} · {comp.date}</p>
                      {comp.includesSurprise && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                          Includes Surprise Event
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => deleteComp(e, comp.id!)}
                        className="text-red-400 hover:text-red-600 p-2 text-lg"
                      >
                        ×
                      </button>
                      <span className="text-gray-300 text-xl">›</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {competitions.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm">No competitions yet. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
