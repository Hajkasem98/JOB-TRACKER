import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApplicationsStore } from '../store/applicationsStore'
import { useTasksStore } from '../store/tasksStore'
import ApplicationForm from '../components/ApplicationForm'
import Timeline from '../components/Timeline'
import Documents from '../components/Documents'
import { formatDate } from '../utils/formatDate'

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

const emptyTaskForm = { title: '', description: '', dueDate: '' }

const fieldClasses = 'flex flex-1 min-w-[160px] flex-col gap-1 text-sm text-gray-600 dark:text-gray-400'
const fieldWideClasses = 'flex basis-full flex-col gap-1 text-sm text-gray-600 dark:text-gray-400'
const inputClasses =
  'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
const primaryBtnClasses =
  'rounded-md border border-violet-600 bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700'
const secondaryBtnClasses =
  'rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:border-violet-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
const linkBtnClasses = 'text-violet-600 hover:underline dark:text-violet-400'

export default function ApplicationDetailPage() {
  const { id } = useParams()
  const applicationId = Number(id)
  const navigate = useNavigate()

  const {
    selectedApplication: app,
    loading,
    error,
    fetchApplicationDetail,
    updateApplication,
    updateStage,
    deleteApplication,
    clearSelectedApplication,
  } = useApplicationsStore()

  const { tasks, fetchTasks, createTask, completeTask, deleteTask } = useTasksStore()

  const [editing, setEditing] = useState(false)
  const [stageNote, setStageNote] = useState('')
  const [pendingStage, setPendingStage] = useState('')
  const [taskForm, setTaskForm] = useState(emptyTaskForm)

  useEffect(() => {
    fetchApplicationDetail(applicationId)
    fetchTasks(applicationId)
    return () => clearSelectedApplication()
  }, [applicationId, fetchApplicationDetail, fetchTasks, clearSelectedApplication])

  useEffect(() => {
    if (app) {
      setPendingStage(app.stage)
    }
  }, [app])

  if (loading && !app) {
    return (
      <div className="mx-auto max-w-5xl">
        <p>Loading…</p>
      </div>
    )
  }

  if (error || !app) {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="text-sm text-red-600 dark:text-red-400">{error ?? 'Application not found.'}</p>
      </div>
    )
  }

  const handleEditSave = async (data) => {
    await updateApplication(applicationId, data)
    setEditing(false)
  }

  const handleDelete = async () => {
    if (window.confirm('Delete this application and all related data?')) {
      await deleteApplication(applicationId)
      navigate('/applications')
    }
  }

  const handleStageUpdate = async () => {
    await updateStage(applicationId, pendingStage, stageNote || undefined)
    setStageNote('')
    fetchApplicationDetail(applicationId)
  }

  const handleTaskChange = (e) => {
    setTaskForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleTaskCreate = async (e) => {
    e.preventDefault()
    await createTask(applicationId, {
      ...taskForm,
      dueDate: taskForm.dueDate || null,
    })
    setTaskForm(emptyTaskForm)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{app.companyName}</h1>
          <p className="text-gray-600 dark:text-gray-400">{app.jobTitle}</p>
        </div>
        <div className="flex gap-2.5">
          <button type="button" className={secondaryBtnClasses} onClick={() => setEditing((v) => !v)}>
            {editing ? 'Cancel edit' : 'Edit'}
          </button>
          <button
            type="button"
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      {editing && (
        <ApplicationForm
          initialValues={{
            companyName: app.companyName,
            jobTitle: app.jobTitle,
            jobPostingUrl: app.jobPostingUrl ?? '',
            location: app.location ?? '',
            salaryMin: app.salaryMin ?? '',
            salaryMax: app.salaryMax ?? '',
            notes: app.notes ?? '',
            appliedOn: app.appliedOn ? app.appliedOn.slice(0, 10) : '',
          }}
          onSubmit={handleEditSave}
          onCancel={() => setEditing(false)}
          submitLabel="Save changes"
        />
      )}

      <section className="my-8">
        <h2 className="mb-3 text-lg font-medium">Stage</h2>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={badgeClasses(app.stage)}>{app.stage}</span>
          <select
            value={pendingStage}
            onChange={(e) => setPendingStage(e.target.value)}
            className={inputClasses}
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            placeholder="Optional note"
            value={stageNote}
            onChange={(e) => setStageNote(e.target.value)}
            className={inputClasses}
          />
          <button type="button" className={primaryBtnClasses} onClick={handleStageUpdate}>
            Update stage
          </button>
        </div>
      </section>

      <section className="my-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Contacts</h2>
          <Link to={`/applications/${applicationId}/contacts`} className={linkBtnClasses}>
            Manage contacts →
          </Link>
        </div>
        {app.contacts.length === 0 && <p className="mt-2 text-gray-600 dark:text-gray-400">No contacts yet.</p>}
        <ul className="mt-3 flex flex-col gap-2.5">
          {app.contacts.map((c) => (
            <li
              key={c.id}
              className="border-b border-gray-200 pb-2.5 dark:border-gray-800"
            >
              <strong className="font-semibold">{c.name}</strong> {c.role && `— ${c.role}`}{' '}
              {c.email && `(${c.email})`}
            </li>
          ))}
        </ul>
      </section>

      <section className="my-8">
        <h2 className="mb-3 text-lg font-medium">Tasks</h2>
        <form
          onSubmit={handleTaskCreate}
          className="mb-5 flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800"
        >
          <label className={fieldClasses}>
            Title
            <input
              name="title"
              value={taskForm.title}
              onChange={handleTaskChange}
              required
              className={inputClasses}
            />
          </label>
          <label className={fieldClasses}>
            Due date
            <input
              type="date"
              name="dueDate"
              value={taskForm.dueDate}
              onChange={handleTaskChange}
              className={inputClasses}
            />
          </label>
          <label className={fieldWideClasses}>
            Description
            <input
              name="description"
              value={taskForm.description}
              onChange={handleTaskChange}
              className={inputClasses}
            />
          </label>
          <button type="submit" className={primaryBtnClasses}>
            Add task
          </button>
        </form>
        <ul className="flex flex-col gap-2.5">
          {tasks.map((t) => (
            <li
              key={t.id}
              className={`flex items-start justify-between gap-3 border-b border-gray-200 pb-2.5 dark:border-gray-800 ${
                t.isCompleted ? 'text-gray-400 line-through dark:text-gray-600' : ''
              }`}
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={t.isCompleted}
                  disabled={t.isCompleted}
                  onChange={() => completeTask(t.id)}
                />
                {t.title}
                {t.dueDate && ` — due ${formatDate(t.dueDate)}`}
              </label>
              <button type="button" className={linkBtnClasses} onClick={() => deleteTask(t.id)}>
                Delete
              </button>
            </li>
          ))}
          {tasks.length === 0 && <li>No tasks yet.</li>}
        </ul>
      </section>

      <section className="my-8">
        <h2 className="mb-3 text-lg font-medium">Documents</h2>
        <Documents
          applicationId={applicationId}
          documents={app.documents}
          onChange={() => fetchApplicationDetail(applicationId)}
        />
      </section>

      <section className="my-8">
        <h2 className="mb-3 text-lg font-medium">Timeline</h2>
        <Timeline
          applicationId={applicationId}
          entries={app.timelineEntries}
          onChange={() => fetchApplicationDetail(applicationId)}
        />
      </section>
    </div>
  )
}
