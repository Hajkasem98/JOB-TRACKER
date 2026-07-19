import StageColumn from './StageColumn'

const STAGES = [
  'Saved',
  'Applied',
  'PhoneScreen',
  'Interviewing',
  'OfferReceived',
  'Rejected',
  'Withdrawn',
  'Accepted',
]

export default function StageBoard({ applications, onStageChange }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGES.map((stage) => (
        <StageColumn
          key={stage}
          stage={stage}
          applications={applications.filter((a) => a.stage === stage)}
          onStageChange={onStageChange}
        />
      ))}
    </div>
  )
}
