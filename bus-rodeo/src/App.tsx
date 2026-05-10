import { useState } from 'react'
import type { Competition, Driver, EventKey } from './types'
import Home from './components/Home'
import CompetitionSetup from './components/CompetitionSetup'
import DriverList from './components/DriverList'
import Leaderboard from './components/Leaderboard'
import EventRouter from './components/EventRouter'

type Screen =
  | { name: 'home' }
  | { name: 'setup' }
  | { name: 'drivers'; competition: Competition }
  | { name: 'leaderboard'; competition: Competition }
  | { name: 'event'; competition: Competition; driver: Driver; eventKey: EventKey }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  function goHome() { setScreen({ name: 'home' }) }
  function goSetup() { setScreen({ name: 'setup' }) }
  function goDrivers(competition: Competition) { setScreen({ name: 'drivers', competition }) }
  function goLeaderboard(competition: Competition) { setScreen({ name: 'leaderboard', competition }) }
  function goEvent(competition: Competition, driver: Driver, eventKey: EventKey) {
    setScreen({ name: 'event', competition, driver, eventKey })
  }

  switch (screen.name) {
    case 'home':
      return <Home onSelect={goDrivers} onCreate={goSetup} />

    case 'setup':
      return <CompetitionSetup onBack={goHome} onCreate={goDrivers} />

    case 'drivers':
      return (
        <DriverList
          competition={screen.competition}
          onBack={goHome}
          onScore={(driver, eventKey) => goEvent(screen.competition, driver, eventKey)}
          onLeaderboard={() => goLeaderboard(screen.competition)}
        />
      )

    case 'leaderboard':
      return (
        <Leaderboard
          competition={screen.competition}
          onBack={() => goDrivers(screen.competition)}
        />
      )

    case 'event':
      return (
        <EventRouter
          driver={screen.driver}
          eventKey={screen.eventKey}
          onBack={() => goDrivers(screen.competition)}
        />
      )
  }
}
