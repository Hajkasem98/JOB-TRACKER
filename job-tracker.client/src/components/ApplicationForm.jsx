import { useState } from 'react'

const emptyForm = {
  companyName: '',
  jobTitle: '',
  jobPostingUrl: '',
  location: '',
  salaryMin: '',
  salaryMax: '',
  notes: '',
  appliedOn: '',
}

const fieldClasses = 'flex flex-1 min-w-[160px] flex-col gap-1 text-sm text-gray-600 dark:text-gray-400'
const fieldWideClasses = 'flex basis-full flex-col gap-1 text-sm text-gray-600 dark:text-gray-400'
const inputClasses =
  'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'

export default function ApplicationForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save' }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit({
      ...form,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      appliedOn: form.appliedOn || null,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-5 flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800"
    >
      <label className={fieldClasses}>
        Company
        <input
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          required
          className={inputClasses}
        />
      </label>
      <label className={fieldClasses}>
        Job title
        <input
          name="jobTitle"
          value={form.jobTitle}
          onChange={handleChange}
          required
          className={inputClasses}
        />
      </label>
      <label className={fieldClasses}>
        Location
        <input name="location" value={form.location} onChange={handleChange} className={inputClasses} />
      </label>
      <label className={fieldClasses}>
        Job posting URL
        <input
          name="jobPostingUrl"
          value={form.jobPostingUrl}
          onChange={handleChange}
          className={inputClasses}
        />
      </label>
      <label className={fieldClasses}>
        Salary min
        <input
          type="number"
          name="salaryMin"
          value={form.salaryMin}
          onChange={handleChange}
          className={inputClasses}
        />
      </label>
      <label className={fieldClasses}>
        Salary max
        <input
          type="number"
          name="salaryMax"
          value={form.salaryMax}
          onChange={handleChange}
          className={inputClasses}
        />
      </label>
      <label className={fieldClasses}>
        Applied on
        <input
          type="date"
          name="appliedOn"
          value={form.appliedOn}
          onChange={handleChange}
          className={inputClasses}
        />
      </label>
      <label className={fieldWideClasses}>
        Notes
        <textarea name="notes" value={form.notes} onChange={handleChange} className={inputClasses} />
      </label>
      <div className="flex gap-2.5">
        <button
          type="submit"
          className="rounded-md border border-violet-600 bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:border-violet-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
