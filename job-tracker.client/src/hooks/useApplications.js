import { useEffect } from 'react'
import { useApplicationsStore } from '../store/applicationsStore'

export function useApplications(page = 1, pageSize = 20) {
  const store = useApplicationsStore()
  const { fetchApplications } = store

  useEffect(() => {
    fetchApplications(page, pageSize)
  }, [page, pageSize, fetchApplications])

  return store
}
