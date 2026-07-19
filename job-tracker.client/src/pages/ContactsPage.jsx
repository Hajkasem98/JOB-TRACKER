import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { createContact, deleteContact, getContacts, updateContact } from '../api/contacts'

const emptyForm = { name: '', role: '', email: '', phone: '', linkedInUrl: '', notes: '' }

const fieldClasses = 'flex flex-1 min-w-[160px] flex-col gap-1 text-sm text-gray-600 dark:text-gray-400'
const fieldWideClasses = 'flex basis-full flex-col gap-1 text-sm text-gray-600 dark:text-gray-400'
const inputClasses =
  'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
const primaryBtnClasses =
  'rounded-md border border-violet-600 bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700'
const secondaryBtnClasses =
  'rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:border-violet-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
const linkBtnClasses = 'text-violet-600 hover:underline dark:text-violet-400'

export default function ContactsPage() {
  const { applicationId } = useParams()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const load = () => {
    setLoading(true)
    getContacts(applicationId)
      .then(setContacts)
      .catch(() => setError('Could not load contacts.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [applicationId])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingId) {
      await updateContact(editingId, form)
    } else {
      await createContact(applicationId, form)
    }
    resetForm()
    load()
  }

  const startEdit = (contact) => {
    setForm({
      name: contact.name,
      role: contact.role ?? '',
      email: contact.email ?? '',
      phone: contact.phone ?? '',
      linkedInUrl: contact.linkedInUrl ?? '',
      notes: contact.notes ?? '',
    })
    setEditingId(contact.id)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this contact?')) {
      await deleteContact(id)
      load()
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <Link to={`/applications/${applicationId}`} className={linkBtnClasses}>
          ← Back to application
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-5 flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800"
      >
        <label className={fieldClasses}>
          Name
          <input name="name" value={form.name} onChange={handleChange} required className={inputClasses} />
        </label>
        <label className={fieldClasses}>
          Role
          <input name="role" value={form.role} onChange={handleChange} className={inputClasses} />
        </label>
        <label className={fieldClasses}>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={inputClasses}
          />
        </label>
        <label className={fieldClasses}>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} className={inputClasses} />
        </label>
        <label className={fieldClasses}>
          LinkedIn URL
          <input
            name="linkedInUrl"
            value={form.linkedInUrl}
            onChange={handleChange}
            className={inputClasses}
          />
        </label>
        <label className={fieldWideClasses}>
          Notes
          <textarea name="notes" value={form.notes} onChange={handleChange} className={inputClasses} />
        </label>
        <div className="flex gap-2.5">
          <button type="submit" className={primaryBtnClasses}>
            {editingId ? 'Save changes' : 'Add contact'}
          </button>
          {editingId && (
            <button type="button" className={secondaryBtnClasses} onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {loading && <p>Loading…</p>}

      <ul className="flex flex-col gap-2.5">
        {contacts.map((c) => (
          <li
            key={c.id}
            className="flex items-start justify-between gap-3 border-b border-gray-200 pb-2.5 dark:border-gray-800"
          >
            <div>
              <strong className="font-semibold">{c.name}</strong> {c.role && `— ${c.role}`}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {c.email && <span>{c.email} </span>}
                {c.phone && <span>{c.phone}</span>}
              </div>
            </div>
            <div className="flex shrink-0 gap-3">
              <button type="button" className={linkBtnClasses} onClick={() => startEdit(c)}>
                Edit
              </button>
              <button type="button" className={linkBtnClasses} onClick={() => handleDelete(c.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
        {contacts.length === 0 && !loading && <li>No contacts yet.</li>}
      </ul>
    </div>
  )
}
