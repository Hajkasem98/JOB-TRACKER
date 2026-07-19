import { Link } from 'react-router-dom'

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

export default function ApplicationCard({ application, onStageChange }) {
  return (
    <div className="mb-2.5 flex flex-col gap-2 rounded-md border border-gray-200 p-2.5 dark:border-gray-800">
      <Link to={`/applications/${application.id}`} className="text-gray-900 dark:text-gray-100">
        <strong className="block text-sm font-semibold">{application.companyName}</strong>
        <div className="text-sm text-gray-600 dark:text-gray-400">{application.jobTitle}</div>
      </Link>
      <select
        value={application.stage}
        onChange={(e) => onStageChange(application.id, e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      >
        {STAGES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  )
}
