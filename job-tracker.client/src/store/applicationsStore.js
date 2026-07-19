import { createContext, createElement, useCallback, useContext, useMemo, useState } from 'react'
import * as applicationsApi from '../api/applications'

const ApplicationsContext = createContext(/** @type {any} */ (null))

export function ApplicationsProvider({ children }) {
  const [applications, setApplications] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchApplications = useCallback(async (nextPage = 1, nextPageSize = 20) => {
    setLoading(true)
    setError(null)
    try {
      const result = await applicationsApi.getApplications(nextPage, nextPageSize)
      setApplications(result.items)
      setTotalCount(result.totalCount)
      setPage(result.page)
      setPageSize(result.pageSize)
      return result
    } catch (err) {
      setError('Could not load applications.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchApplicationDetail = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      const detail = await applicationsApi.getApplication(id)
      setSelectedApplication(detail)
      return detail
    } catch (err) {
      setError('Could not load application.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createApplication = useCallback(async (data) => {
    const created = await applicationsApi.createApplication(data)
    setApplications((prev) => [created, ...prev])
    setTotalCount((prev) => prev + 1)
    return created
  }, [])

  const updateApplication = useCallback(async (id, data) => {
    const updated = await applicationsApi.updateApplication(id, data)
    setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)))
    setSelectedApplication((prev) => (prev && prev.id === id ? { ...prev, ...updated } : prev))
    return updated
  }, [])

  const deleteApplication = useCallback(async (id) => {
    await applicationsApi.deleteApplication(id)
    setApplications((prev) => prev.filter((a) => a.id !== id))
    setTotalCount((prev) => Math.max(0, prev - 1))
    setSelectedApplication((prev) => (prev && prev.id === id ? null : prev))
  }, [])

  const updateStage = useCallback(async (id, stage, note) => {
    const updated = await applicationsApi.updateStage(id, stage, note)
    setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)))
    setSelectedApplication((prev) => (prev && prev.id === id ? { ...prev, ...updated } : prev))
    return updated
  }, [])

  const clearSelectedApplication = useCallback(() => setSelectedApplication(null), [])

  const value = useMemo(
    () => ({
      applications,
      totalCount,
      page,
      pageSize,
      selectedApplication,
      loading,
      error,
      fetchApplications,
      fetchApplicationDetail,
      createApplication,
      updateApplication,
      deleteApplication,
      updateStage,
      clearSelectedApplication,
    }),
    [
      applications,
      totalCount,
      page,
      pageSize,
      selectedApplication,
      loading,
      error,
      fetchApplications,
      fetchApplicationDetail,
      createApplication,
      updateApplication,
      deleteApplication,
      updateStage,
      clearSelectedApplication,
    ],
  )

  return createElement(ApplicationsContext.Provider, { value }, children)
}

export function useApplicationsStore() {
  const context = useContext(ApplicationsContext)
  if (!context) {
    throw new Error('useApplicationsStore must be used within an ApplicationsProvider')
  }
  return context
}
