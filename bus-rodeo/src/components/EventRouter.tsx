import type { Driver, EventKey } from '../types'
import WrittenTest from './scoring/WrittenTest'
import OffsetAlley from './scoring/OffsetAlley'
import RXRCrossing from './scoring/RXRCrossing'
import RightTurn from './scoring/RightTurn'
import StraightLine from './scoring/StraightLine'
import DiminishingClearance from './scoring/DiminishingClearance'
import BackupStall from './scoring/BackupStall'
import LeftTurn from './scoring/LeftTurn'
import ParallelParking from './scoring/ParallelParking'
import CurbLineLoading from './scoring/CurbLineLoading'
import StopLine from './scoring/StopLine'
import SurpriseEvent from './scoring/SurpriseEvent'

interface Props {
  driver: Driver
  eventKey: EventKey
  onBack: () => void
}

export default function EventRouter({ driver, eventKey, onBack }: Props) {
  switch (eventKey) {
    case 'written_general':
    case 'written_inspection':
      return <WrittenTest driver={driver} eventKey={eventKey} onBack={onBack} />
    case 'offset_alley':
      return <OffsetAlley driver={driver} onBack={onBack} />
    case 'rxr_crossing':
      return <RXRCrossing driver={driver} onBack={onBack} />
    case 'right_turn':
      return <RightTurn driver={driver} onBack={onBack} />
    case 'straight_line':
      return <StraightLine driver={driver} onBack={onBack} />
    case 'diminishing_clearance':
      return <DiminishingClearance driver={driver} onBack={onBack} />
    case 'backup_stall':
      return <BackupStall driver={driver} onBack={onBack} />
    case 'left_turn':
      return <LeftTurn driver={driver} onBack={onBack} />
    case 'parallel_parking':
      return <ParallelParking driver={driver} onBack={onBack} />
    case 'curb_line_loading':
      return <CurbLineLoading driver={driver} onBack={onBack} />
    case 'stop_line':
      return <StopLine driver={driver} onBack={onBack} />
    case 'surprise':
      return <SurpriseEvent driver={driver} onBack={onBack} />
    default:
      return <div className="p-8 text-center text-gray-500">Unknown event</div>
  }
}
