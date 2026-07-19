import { useState } from 'react'
import { addTimelineEntry, deleteTimelineEntry } from '../api/timeline'
import { formatDateTime } from '../utils/formatDate'

const TIMELINE_EVENT_TYPES = ['Note', 'Interview', 'Email', 'PhoneCall', 'Other']
const emptyForm = { eventType: 'Note', title: '', description: '' }

const fieldClasses = 'flex flex-1 min-w-[160px] flex-col gap-1 text-sm text-gray-600 dark:text-gray-400'
const fieldWideClasses = 'flex basis-full flex-col gap-1 text-sm text-gray-600 dark:text-gray-400'
const inputClasses =
  'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'

export default function Timeline({ applicationId, entries, onChange }) {
  const [form, setForm] = useState(emptyForm)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addTimelineEntry(applicationId, form)
    setForm(emptyForm)
    onChange()
  }

  const handleDelete = async (id) => {
    await deleteTimelineEntry(id)
    onChange()
  }

  const sorted = [...entries].sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt))

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mb-5 flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800"
      >
        <label className={fieldClasses}>
          Type
          <select name="eventType" value={form.eventType} onChange={handleChange} className={inputClasses}>
            {TIMELINE_EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className={fieldClasses}>
          Title
          <input name="title" value={form.title} onChange={handleChange} required className={inputClasses} />
        </label>
        <label className={fieldWideClasses}>
          Description
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            className={inputClasses}
          />
        </label>
        <button
          type="submit"
          className="rounded-md border border-violet-600 bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Add entry
        </button>
      </form>
      <ul className="flex flex-col gap-2.5">
        {sorted.map((entry) => (
          <li
            key={entry.id}
            className="flex items-start justify-between gap-3 border-b border-gray-200 pb-2.5 dark:border-gray-800"
          >
            <div>
              <strong className="font-semibold">{entry.eventType}</strong> — {entry.title}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatDateTime(entry.occurredAt)}
              </div>
              {entry.description && <p className="mt-1 text-sm">{entry.description}</p>}
            </div>
            <button
              type="button"
              className="shrink-0 text-violet-600 hover:underline dark:text-violet-400"
              onClick={() => handleDelete(entry.id)}
            >
              Delete
            </button>
          </li>
        ))}
        {sorted.length === 0 && <li>No timeline entries yet.</li>}
      </ul>
    </>
  )
}
