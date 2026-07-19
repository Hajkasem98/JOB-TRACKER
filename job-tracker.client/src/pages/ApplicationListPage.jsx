import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApplications } from '../hooks/useApplications'
import ApplicationForm from '../components/ApplicationForm'
import { formatDate } from '../utils/formatDate'

const PAGE_SIZE = 20

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

export default function ApplicationListPage() {
  const [page, setPage] = useState(1)
  const { applications, totalCount, loading, error, createApplication, deleteApplication } =
    useApplications(page, PAGE_SIZE)

  const [showForm, setShowForm] = useState(false)

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  const handleCreate = async (data) => {
    await createApplication(data)
    setShowForm(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this application?')) {
      await deleteApplication(id)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold">Applications</h1>
        <button
          type="button"
          className="rounded-md border border-violet-600 bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Cancel' : 'New application'}
        </button>
      </div>

      {showForm && <ApplicationForm onSubmit={handleCreate} submitLabel="Save" />}

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {loading && <p>Loading…</p>}

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-b border-gray-200 px-3 py-2.5 text-left dark:border-gray-800">Company</th>
            <th className="border-b border-gray-200 px-3 py-2.5 text-left dark:border-gray-800">
              Job title
            </th>
            <th className="border-b border-gray-200 px-3 py-2.5 text-left dark:border-gray-800">Stage</th>
            <th className="border-b border-gray-200 px-3 py-2.5 text-left dark:border-gray-800">
              Applied on
            </th>
            <th className="border-b border-gray-200 px-3 py-2.5 text-left dark:border-gray-800"></th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td className="border-b border-gray-200 px-3 py-2.5 dark:border-gray-800">
                {app.companyName}
              </td>
              <td className="border-b border-gray-200 px-3 py-2.5 dark:border-gray-800">{app.jobTitle}</td>
              <td className="border-b border-gray-200 px-3 py-2.5 dark:border-gray-800">
                <span className={badgeClasses(app.stage)}>{app.stage}</span>
              </td>
              <td className="border-b border-gray-200 px-3 py-2.5 dark:border-gray-800">
                {formatDate(app.appliedOn)}
              </td>
              <td className="border-b border-gray-200 px-3 py-2.5 dark:border-gray-800">
                <div className="flex gap-3">
                  <Link
                    to={`/applications/${app.id}`}
                    className="text-violet-600 hover:underline dark:text-violet-400"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    className="text-violet-600 hover:underline dark:text-violet-400"
                    onClick={() => handleDelete(app.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {applications.length === 0 && !loading && (
            <tr>
              <td colSpan={5} className="border-b border-gray-200 px-3 py-2.5 dark:border-gray-800">
                No applications yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:border-violet-400 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:border-violet-400 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
