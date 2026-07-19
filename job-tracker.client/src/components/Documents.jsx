import { useState } from 'react'
import { deleteDocument, downloadDocument, uploadDocument } from '../api/documents'
import { formatDate } from '../utils/formatDate'

const DOCUMENT_TYPES = ['Resume', 'CoverLetter', 'OfferLetter', 'Other']

const fieldClasses = 'flex flex-1 min-w-[160px] flex-col gap-1 text-sm text-gray-600 dark:text-gray-400'
const inputClasses =
  'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
const primaryBtnClasses =
  'rounded-md border border-violet-600 bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50'
const linkBtnClasses = 'text-violet-600 hover:underline dark:text-violet-400'

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function Documents({ applicationId, documents, onChange }) {
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState('Resume')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    setError(null)
    try {
      await uploadDocument(applicationId, file, fileType)
      setFile(null)
      e.target.reset()
      onChange()
    } catch {
      setError('Could not upload the file.')
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (doc) => {
    const blob = await downloadDocument(doc.id)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = doc.fileName
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const handleDelete = async (id) => {
    await deleteDocument(id)
    onChange()
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mb-5 flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800"
      >
        <label className={fieldClasses}>
          File
          <input
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
            className={inputClasses}
          />
        </label>
        <label className={fieldClasses}>
          Type
          <select value={fileType} onChange={(e) => setFileType(e.target.value)} className={inputClasses}>
            {DOCUMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={uploading} className={primaryBtnClasses}>
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </form>

      {error && <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <ul className="flex flex-col gap-2.5">
        {documents.map((d) => (
          <li
            key={d.id}
            className="flex items-start justify-between gap-3 border-b border-gray-200 pb-2.5 dark:border-gray-800"
          >
            <div>
              <strong className="font-semibold">{d.fileName}</strong> — {d.fileType}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(d.fileSizeBytes)} · uploaded {formatDate(d.uploadedAt)}
              </div>
            </div>
            <div className="flex shrink-0 gap-3">
              <button type="button" className={linkBtnClasses} onClick={() => handleDownload(d)}>
                Download
              </button>
              <button type="button" className={linkBtnClasses} onClick={() => handleDelete(d.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
        {documents.length === 0 && <li>No documents yet.</li>}
      </ul>
    </>
  )
}
