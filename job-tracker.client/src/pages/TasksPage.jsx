import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTasksStore } from '../store/tasksStore'
import { formatDate } from '../utils/formatDate'

const linkBtnClasses = 'text-violet-600 hover:underline dark:text-violet-400'
const inputClasses =
  'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'

export default function TasksPage() {
  const { upcomingTasks, loading, error, fetchUpcoming, completeTask, deleteTask } = useTasksStore()
  const [withinDays, setWithinDays] = useState(7)

  useEffect(() => {
    fetchUpcoming(withinDays)
  }, [withinDays, fetchUpcoming])

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Upcoming tasks</h1>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          Within
          <select
            value={withinDays}
            onChange={(e) => setWithinDays(Number(e.target.value))}
            className={inputClasses}
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
          </select>
        </label>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {loading && <p>Loading…</p>}

      <ul className="flex flex-col gap-2.5">
        {upcomingTasks.map((t) => (
          <li
            key={t.id}
            className="flex items-start justify-between gap-3 border-b border-gray-200 pb-2.5 dark:border-gray-800"
          >
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={t.isCompleted} onChange={() => completeTask(t.id)} />
                <strong className="font-semibold">{t.title}</strong>
              </label>
              {t.dueDate && <div className="text-sm text-gray-600 dark:text-gray-400">Due {formatDate(t.dueDate)}</div>}
              {t.description && <p className="mt-1 text-sm">{t.description}</p>}
              <Link to={`/applications/${t.applicationId}`} className={linkBtnClasses}>
                View application →
              </Link>
            </div>
            <button type="button" className={linkBtnClasses} onClick={() => deleteTask(t.id)}>
              Delete
            </button>
          </li>
        ))}
        {upcomingTasks.length === 0 && !loading && <li>No upcoming tasks.</li>}
      </ul>
    </div>
  )
}
