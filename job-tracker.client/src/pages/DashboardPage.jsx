import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStats } from '../api/dashboard'
import StatsCard from '../components/StatsCard'

const STAGE_BADGE_CLASSES = {
  offerreceived: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  accepted: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  withdrawn: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}
const DEFAULT_BADGE_CLASSES = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'

function badgeClasses(stage) {
  const color = STAGE_BADGE_CLASSES[stage.toLowerCase()] ?? DEFAULT_BADGE_CLASSES
  return `inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError('Could not load dashboard stats.'))
  }, [])

  if (error) {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="mx-auto max-w-5xl">
        <p>Loading…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-5 text-2xl font-semibold">Dashboard</h1>

      <div className="mb-6 flex flex-wrap gap-4">
        <StatsCard value={stats.totalApplications} label="Total applications" />
        <StatsCard value={stats.activeApplications} label="Active" />
        <StatsCard value={stats.offersReceived} label="Offers received" />
        <StatsCard value={stats.rejectionCount} label="Rejections" />
        <StatsCard value={stats.upcomingTasksCount} label="Upcoming tasks" />
      </div>

      <h2 className="mb-3 text-lg font-medium">By stage</h2>
      <ul className="mb-8 flex flex-wrap gap-2.5">
        {Object.entries(stats.applicationsByStage).map(([stage, count]) => (
          <li
            key={stage}
            className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 dark:border-gray-800"
          >
            <span className={badgeClasses(stage)}>{stage}</span>
            <span>{count}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-2.5">
        <Link
          className="rounded-md border border-violet-600 bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          to="/applications"
        >
          View applications
        </Link>
        <Link
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:border-violet-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          to="/stage"
        >
          View stage board
        </Link>
      </div>
    </div>
  )
}
